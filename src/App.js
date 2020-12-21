import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import "./App.css";

function App() {
	const [userData, setUserData] = useState({ to: "", message: "" });
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowSuccessMessage(false);
			setShowErrorMessage(false);
		}, 3000);
	}, [showSuccessMessage, showErrorMessage]);

	const handleInputChange = (e) => {
		setUserData((prevState) => {
			return {
				...prevState,
				[e.target.name]: e.target.value,
			};
		});
	};

	const sendMessage = () => {
		const { to, message } = userData;
		if (to !== "" && message !== "") {
			axios({
				method: "post",
				url: `${process.env.REACT_APP_BASE_URL}/Accounts/${process.env.REACT_APP_TWILIO_ACCOUNT_SID}/Messages.json`,
				auth: {
					username: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
					password: process.env.REACT_APP_TWILIO_AUTH_TOKEN,
				},
				headers: {
					"Content-Type":
						"application/x-www-form-urlencoded;charset=utf-8",
				},
				data: qs.stringify({
					To: userData.to,
					From: process.env.REACT_APP_PHONE_NUMBER,
					Body: userData.message,
				}),
			})
				.then((response) => {
					setUserData({ ...userData, to: "", message: "" });
					setShowSuccessMessage(true);
				})
				.catch((err) => {
					console.log(err);
					setUserData({ ...userData, to: "", message: "" });
					setShowErrorMessage(true);
				});
		}
	};

	return (
		<div className="container bg-light pb-5">
			<div className="row">
				<div className="col-md-8 offset-md-2">
					<h1 className="text-success text-center pt-5">
						Web Messaging APP
					</h1>
					<hr />

					{showErrorMessage && (
						<div className="alert alert-danger py-3" role="alert">
							Oops!! Something went wrong. Sorry Messang not sent!
						</div>
					)}

					{showSuccessMessage && (
						<div className="alert alert-success py-3" role="alert">
							Message sent successfully!
						</div>
					)}

					<form className="pt-3" onSubmit={(e) => e.preventDefault()}>
						<div className="form-group">
							<label>From:</label>
							<input
								type="text"
								className="form-control"
								id="exampleFormControlInput1"
								placeholder="name@example.com"
								value="+12517583703"
								disabled
							/>
						</div>

						<div className="form-group">
							<label>To:</label>
							<input
								type="text"
								name="to"
								className="form-control"
								placeholder="+880170000000"
								value={userData.to}
								onChange={handleInputChange}
							/>
						</div>
						<div className="form-group">
							<label>Message:</label>
							<textarea
								className="form-control"
								rows="3"
								name="message"
								placeholder="Type your message"
								value={userData.message}
								onChange={handleInputChange}
							></textarea>
						</div>
						<button
							className="btn btn-success btn-block"
							onClick={sendMessage}
						>
							Send Message
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default App;
