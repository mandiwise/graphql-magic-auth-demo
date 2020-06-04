import Datastore from "nedb-promises";
import path from "path";

export default Datastore.create({
  autoload: true,
  filename: path.resolve(__dirname + "/../data/users.db")
});
