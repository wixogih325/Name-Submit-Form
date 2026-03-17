function NameSchema({ firstName, lastName, age, village }) {
  if (firstName && lastName && !isNaN(+age) && village) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.village = village;
  } else {
    throw {
      message: "Schema Reject The Data"
    }
  }
}

module.exports = NameSchema;