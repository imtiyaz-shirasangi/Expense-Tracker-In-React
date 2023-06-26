
import React, { useEffect, useState } from "react";
import classes from "./ExpensesList.module.css";
import { useDispatch} from "react-redux";
import { expenseActions } from "../store/Expense";

const ExpenseList = (props) => {
  const [receivedExpense, setReceivedExpense] = useState([]);
  const dispatch = useDispatch();




  useEffect(() => {
    fetch(
      "https://http-authentication1-default-rtdb.firebaseio.com/expense.json"
    )
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const data = await response.json();
          if (data.error.message) {
            alert(data.error.message);
          }
        }
      })
      .then((data) => {
        console.log("data ", data);
        setReceivedExpense(data);
        dispatch(expenseActions.recivedData(data));
      },[dispatch]);

    let totalAmount = 0;
    if (receivedExpense) {
      Object.values(receivedExpense).forEach((expense) => {
        totalAmount += +expense.amount;
      });
    }

    if (totalAmount > 1000) {
      dispatch(expenseActions.Premium());
    } else {
      dispatch(expenseActions.notPremium());
    }
  }, [dispatch, receivedExpense]);

  const deleteHandler = async (key) => {
    console.log("key", key);
    const response = await fetch(
      `https://http-authentication1-default-rtdb.firebaseio.com/expense${key}.json`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setReceivedExpense((prevExpenses) => {
        const updatedExpenses = { ...prevExpenses };
        delete updatedExpenses[key];
        return updatedExpenses;
      });
    }
  }



  const editHandler = async (key) => {
    const response = await fetch(
      `https://http-authentication1-default-rtdb.firebaseio.com/expense${key}.json`
    );
    const data = await response.json();
    console.log(data);

    const { amount, description, category } = receivedExpense[key];

    const obj = {
      amount: amount,
      description: description,
      category: category,
    };
    props.onEdit(obj);
    deleteHandler(key);
  };

  let totalAmount = 0;

  if (receivedExpense) {
    Object.values(receivedExpense).forEach((expense) => {
      totalAmount += +expense.amount;
    });
  } else {
    totalAmount = 0;
  }

  return (
    <React.Fragment>
      <ul className={classes.ul}>
        {receivedExpense ? (
          Object.keys(receivedExpense).map((key) => (
            <ul key={key}>
              <li>{receivedExpense[key].amount}/-</li>
              <li>{receivedExpense[key].description}</li>
              <li>{receivedExpense[key].category}</li>
              <div className={classes.actions}>
                <button
                  className={classes.edit}
                  onClick={() => editHandler(key)}
                >
                  Edit
                </button>
                <button
                  className={classes.delete}
                  onClick={() => deleteHandler(key)}
                >
                  Delete
                </button>
              </div>
            </ul>
          ))
        ) : (
          <h2
            style={{
              textAlign: "center",
              padding: "50px",
            }}
          >
            No data found{" "}
          </h2>
        )}
      </ul>
      <div>
        <h1>Total Amount:{totalAmount}</h1>
      </div>
    </React.Fragment>
  );
};

export default ExpenseList;