import {mechanical_branches} from "./branches.js";
import {Electrical_branches} from "./branches.js";
import {computer_branches} from "./branches.js";
import {civil_branches} from "./branches.js";
import {chemical_branches} from "./branches.js";
import {health_branches} from "./branches.js";
import {nuclear_branches} from "./branches.js";

export default {
  Mechanical: {
    name: "Mechanical Engineering",
    branches: mechanical_branches,
  },
  Electrical: {
    name: "Electrical Engineering",
    branches: Electrical_branches,
  },
  Civil: {
    name: "Civil & Architectural Engineering",
    branches: civil_branches,
  },
  Chemical: {
    name: "Chemical, Bio & Materials Engineering",
    branches: chemical_branches,
  },
  Computer: {
    name: "Computer, IT & Emerging Tech Engineering",
    branches: computer_branches,
  },
  Health: {
    name: "Health, Agriculture & Environmental Engineering",
    branches: health_branches,
  },
  Nuclear: {
    name: "Nuclear, Defense & Advanced Sciences",
    branches: nuclear_branches,
  },
};
