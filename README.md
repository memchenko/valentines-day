# An application for Valentines Day

An idea of this application is to let people say (and write) a message anonymously. The application consists of:
* client part (HTML5, CSS3, Bootstrap 4, jQuery, Socket.io):
  * a form for a message
  * a chat that displays all sent messages
  * a sketcher (just for fun)
* server part that treat requests for messages and sketches (Node.js, MongoDB, Express, Socket.io, ftp-srv)
* device part that speaks sent messages (Node.js, Express, ftp, speaker, wav)

The application translates text to speech using Yandex TTS API
