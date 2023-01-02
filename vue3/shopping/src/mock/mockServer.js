import Mock from "mockjs";

import banner from "./banner";

Mock.mock("/mock/banner", { code: 200, data: banner });
