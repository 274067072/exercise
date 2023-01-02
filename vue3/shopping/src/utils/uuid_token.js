import { v4 as uuidv4 } from "uuid";
export const getUUid = () => {
  let id = localStorage.getItem("UUID");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("UUID", id);
  }
  return id;
};
