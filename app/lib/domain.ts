import { mechanical_branches } from "./branches";
import { Electrical_branches } from "./branches";
import { computer_branches } from "./branches";
import { civil_branches } from "./branches";
import { chemical_branches } from "./branches";
import { health_branches } from "./branches";
import { nuclear_branches } from "./branches";

const domains = {
    Mechanical:{
        name:  "Mechanical Engineering",
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
    }
}
