import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [name, setName] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState("");

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const response = await fetch(url);
    return await response.json();
  }

  async function handleDelete(transactionId) {
    const url = `${process.env.REACT_APP_API_URL}/transaction/${transactionId}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction._id !== transactionId)
      );
    } else {
      console.error('Failed to delete transaction');
    }
  }

  function isValidInput(text) {
    return /^[A-Za-z\s]+$/.test(text);
  }

  function addNewTransaction(event) {
    event.preventDefault();

    if (!isValidInput(name) || !isValidInput(description)) {
      setError("Name and Description must contain only English letters and spaces.");
      return;
    }

    setError(""); // Clear error if input is valid

    const url = process.env.REACT_APP_API_URL + "/transaction";
  
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        dateTime,
        price: Number(price)
      }),
    })
      .then(response => response.json())
      .then((newTransaction) => {
        if (!newTransaction || newTransaction.error) {
          setError(newTransaction.error || "Failed to add transaction.");
          return;
        }

        setName("");
        setDescription("");
        setDateTime("");
        setPrice("");

        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      })
      .catch(error => {
        console.error("Error adding transaction:", error);
        setError("An error occurred while adding the transaction.");
      });
  } 

  let balance = transactions.reduce((sum, transaction) => sum + Number(transaction.price) || 0, 0);

  return (
    <main>
      <h1>{balance}</h1>
      <form onSubmit={addNewTransaction}>

        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}

        <div className='basic'>
          <input type="text" placeholder={'Item'} value={name} required onChange={(event) => setName(event.target.value)} />
          <input type="datetime-local" value={dateTime} required onChange={(event) => setDateTime(event.target.value)} />
        </div>

        <div className='description'>
          <input type="text" placeholder={'Description'} value={description} required onChange={(event) => setDescription(event.target.value)} />
        </div>

        <div className='price'>
          <input type="text" placeholder={'Price'} value={price} required min={"1"} onChange={(event) => setPrice(event.target.value)} />
        </div>

        <button>Add New Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div key={transaction._id}>
              <div className="transaction">
                <div className='transaction-data'>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div className={"price"}>{Number(transaction.price)}</div>
                    <div className="datetime">
                      {new Date(transaction.dateTime)
                        .toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(",", " ")}
                    </div>
                  </div>
                </div>
                <button
                  className="transaction-completed"
                  onClick={() => handleDelete(transaction._id)}
                >
                  Done
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;