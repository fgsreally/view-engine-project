import express from "express";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import request from "supertest";
import { initApp, setStorage } from "../src";
import fconfig from "./Fconfig.json";
function createServer() {
  let app = express();
  setStorage("find", (req) => {
    return "find";
  });
  app.get("/", (req, res) => {
    res.end("find");
  });
  initApp(fconfig, app);
  return app;
}

describe("loading express", function () {
  var server = createServer();
  // beforeEach(function () {
  //   server = createServer();
  // });
  // afterEach(function () {
  //   server.close();
  // });
  it("responds to /new", async function () {
    const response = await request(server).get("/new").expect(200);
    expect(response.body).toBe("find");
  });
});
