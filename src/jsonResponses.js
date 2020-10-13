// Note this object is purely in memory
let events = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // no content to send, just headers!
  response.writeHead(status, headers);
  response.end();
};

const getEvents = (request, response) => {
  const responseJSON = {
    events,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getEventsMeta = (request, response) => respondJSONMeta(request, response, 200);

const addEvent = (request, response, body) => {
  const responseJSON = {
    message: 'name, date, and description are required',
  };

  if (!body.name || !body.date || !body.description) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON); // 400=bad request
  }

  let responseCode = 201; // "created"
  if (events[body.name]) { // user exists
    responseCode = 204; // updating, so "no content"
  } else {
    events[body.name] = {}; // make a new user
  }

  // update or initialize values, as the case may be
  events[body.name].name = body.name;
  events[body.name].date = body.date;
  events[body.name].description = body.description;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode); // this is for 204, a "no content" header
};

const updateEvents = (request, response) => {
  const newEvent = {
    createdAt: Date.now(),
  };

  events[newEvent.createdAt] = newEvent; // never do this in the real world!
  // 201 status code == "created"
  return respondJSON(request, response, 201, newEvent);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const deleteEvent = (request, response, body) => {
  events = body;
  //delete events[];
  return respondJSONMeta(request, response, 200);
}

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getEvents,
  getEventsMeta,
  addEvent,
  updateEvents,
  notFound,
  notFoundMeta,
  deleteEvent
};
