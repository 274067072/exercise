export default function (route, name, argu) {
  const location = { name };
  if (typeof argu === "object") {
    location["query"] = argu;
    if (route.params) {
      location["params"] = route.params;
    }
  } else {
    location["params"] = { keyword: argu };
    if (route.query) {
      location["query"] = route.query;
    }
  }
  return location;
}
