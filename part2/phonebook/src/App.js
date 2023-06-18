import { useState, useEffect } from "react";
import contactService from "./services/persons";
import './index.css'

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="success">{message}</div>;
};

const Contact = ({ name, number, deletion }) => (
  <li>
    {name} {number} <button onClick={deletion}>delete</button>
  </li>
);

const Filter = ({ value, handleNewFilter }) => {
  return (
    <div>
      Filter shown with <input value={value} onChange={handleNewFilter} />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:
        <input value={props.newName} onChange={props.handleNewName} />
      </div>
      <div>
        number:
        <input value={props.newNumber} onChange={props.handleNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personsToShow, setPersons, persons }) => {
  return personsToShow.map((person) => (
    <Contact
      key={person.name}
      name={person.name}
      number={person.number}
      deletion={() => deletion(person.id, setPersons, persons)}
    />
  ));
};

const deletion = (id, setPersons, persons) => {
  const person = persons.find((n) => n.id === id);
  if (window.confirm(`Delete ${person.name} ?`)) {
    contactService
      .deletion(id)
      .then((response) => {
        setPersons(persons.filter((n) => n.id !== id));
      })
      .catch((error) => {
        setPersons(persons.filter((n) => n.id !== id));
      });
  }
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    checkPersonExists(newName)
      ? window.confirm(
          `${newName} is already added to phonebook, replace the old number with new one?`
        )
      : contactService.create(personObject).then((returnedContact) => {
          setPersons(persons.concat(returnedContact));
          setNewName("");
          setNewNumber("");
          setSuccessMessage(
            `Added ${newName}`
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        });
  };

  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  const checkPersonExists = (name) => {
    return persons.some((person) => person.name.includes(name));
  };

  const personsToShow =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter value={newFilter} handleNewFilter={handleNewFilter} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        setPersons={setPersons}
        persons={persons}
      />
    </div>
  );
};

export default App;
