require("dotenv").config();
import fastify from "fastify";
import closeWithGrace, { CloseWithGraceAsyncCallback } from "close-with-grace";

const app = fastify({
  logger: true,
});

// Register your application as a normal plugin.
const appService = require("./app.js");
app.register(appService);

// delay is the number of milliseconds for the graceful close to finish
const closeWithGraceCallback: CloseWithGraceAsyncCallback = async function ({
  signal,
  err,
  manual,
}) {
  if (err) {
    app.log.error(err);
  }
  await app.close();
};
const closeListeners = closeWithGrace({ delay: 500 }, closeWithGraceCallback);

app.addHook("onClose", (instance, done) => {
  closeListeners.uninstall();
  done();
});

app.listen(process.env.PORT || 5000, () => {
  app.log.info(`Server started listenning on ${process.env.PORT || 3000}`);
});
