class Employee {
  viewAll() {
    const query = "SELECT * FROM allEmployees";
    connection.query(query, (err, res) => {
      console.table(res);
    });
  }
}

module.exports = Employee;
