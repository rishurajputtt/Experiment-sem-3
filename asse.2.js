const EventEmitter = require("events");

class Element extends EventEmitter {
    constructor(name, parent = null) {
        super();
        this.name = name;
        this.parent = parent;
    }

    addEventListener(type, handler) {
        this.on(type, handler);
    }

    removeEventListener(type, handler) {
        this.off(type, handler);
    }

    dispatchEvent(type, data) {
        const event = {
            type: type,
            target: this,
            currentTarget: null,
            data: data,
            stopped: false,

            stopPropagation() {
                this.stopped = true;
            }
        };

        let element = this;

        while (element) {
            event.currentTarget = element;

            element.emit(type, event);

            if (event.stopped) {
                break;
            }

            element = element.parent;
        }
    }
}

// Create hierarchy
const documentElement = new Element("document");
const form = new Element("form", documentElement);
const button = new Element("button", form);

// Handlers
const buttonHandler = (event) => {
    console.log(
        `Button listener: target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

const formHandler = (event) => {
    console.log(
        `Form listener: target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

const documentHandler = (event) => {
    console.log(
        `Document listener: target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

// Add click listeners
button.addEventListener("click", buttonHandler);
form.addEventListener("click", formHandler);
documentElement.addEventListener("click", documentHandler);

// Scenario A
console.log("\n--- Scenario A ---");
button.dispatchEvent("click", "Button clicked");

// Scenario B
console.log("\n--- Scenario B ---");

form.removeEventListener("click", formHandler);

const formStopHandler = (event) => {
    console.log(
        `Form listener: target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
    event.stopPropagation();
};

form.addEventListener("click", formStopHandler);

button.dispatchEvent("click", "Button clicked");

// Scenario C
console.log("\n--- Scenario C ---");

button.removeEventListener("click", buttonHandler);

button.dispatchEvent("click", "Button clicked");

// Keypress event
console.log("\n--- Keypress Event ---");

form.addEventListener("keypress", (event) => {
    console.log(
        `Keypress listener: target=${event.target.name}, currentTarget=${event.currentTarget.name}, data=${event.data}`
    );
});

form.dispatchEvent("keypress", "Enter");