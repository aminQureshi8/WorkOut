import Validator from "fastest-validator";

const validator = new Validator({
  useNewCustomCheckerFunction: true,
});

export default validator;
