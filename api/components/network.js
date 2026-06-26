const response = require("./response");
const controller = require("./controller");
const express = require("express");
const utils = require("./utils");

var jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.get("/listaulas", function (req, res) {
  controller
    .getAulas()
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((e) => {
      response.error(req, res, "[NETWORK] " + e, 500, e);
    });
});

router.get("/listsemana", function (req, res) {
  controller
    .getPlaneacionSemana(req.query.dia)
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((e) => {
      response.error(req, res, "[NETWORK] " + e, 500, e);
    });
});

router.post("/insertcurso", function (req, res) {
  controller
    .insertCursoSemana(req.body)
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((e) => {
      response.error(req, res, "[NETWORK] " + e, 500, e);
    });
});

router.post("/updatecurso", function (req, res) {
  controller
    .updateCursoSemana(req.body)
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((e) => {
      response.error(req, res, "[NETWORK] " + e, 500, e);
    });
});

router.post("/updateobservacion", function (req, res) {
  controller
    .updateObservacionSemana(req.body)
    .then((list) => response.success(req, res, list, 200))
    .catch((e) => response.error(req, res, "[NETWORK] " + e, 500, e));
});

router.post("/deletecurso", function (req, res) {
  controller
    .deleteCursoSemana(req.body)
    .then((list) => {
      response.success(req, res, list, 200);
    })
    .catch((e) => {
      response.error(req, res, "[NETWORK] " + e, 500, e);
    });
});

// ✅ NUEVO: actualizar datos del aula (solo nombre y capacidad)
router.post("/updateaula", function (req, res) {
  controller
    .updateAula(req.body)
    .then((r) => response.success(req, res, r, 200))
    .catch((e) => response.error(req, res, "[NETWORK] " + e, 500, e));
});

router.post("/login", function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return response.error(
      req,
      res,
      "Username or Password required.",
      400,
      "Username or Password required.",
    );
  }

  // return 401 status if the credential is not match.

  //if (user != 'logistica' && pwd != 'vvuZI039068b') {
  if (pwd != "vvuZI039068b") {
    return response.error(
      req,
      res,
      "Username or Password is Wrong",
      401,
      "Username or Password is Wrong",
    );
  } else {
    // generate token
    const token = utils.generateToken({ username: user });
    // get basic user details
    const userObj = utils.getCleanUser({ username: user });
    // return the token along with user details
    return res.json({ user: userObj, token });
  }
});

router.get("/verifyToken", function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  //var user = req.body.username || req.query.username;

  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, "secretword1234!", function (err, user) {
    if (err)
      return res.status(401).json({
        error: true,
        message: "Invalid token.",
      });

    // return 401 status if the userId does not match.
    /* if (user.userId !== userData.userId) {
			return res.status(401).json({
				error: true,
				message: 'Invalid user.',
			});
		} */

    // get basic user details
    var userObj = utils.getCleanUser({ username: user });
    return res.json({ user: userObj, token });
  });
});

module.exports = router;
