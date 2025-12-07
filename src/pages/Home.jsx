import { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer, { useContacts } from "../hooks/useGlobalReducer.jsx";
import ContactCard from "../components/ContactCard";

export const Home = () => {
	const { store } = useGlobalReducer()
	const { fetchContacts, deleteContact } = useContacts()

	useEffect(() => {
		fetchContacts()
	}, [fetchContacts])

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>Contacts</h2>
				<Link to="/add" className="btn btn-success">Add new contact</Link>
			</div>

			<div className="list-group">
				{store.contacts.length === 0 && (
					<div className="alert alert-info">No contacts found. Click Add to create one.</div>
				)}

				{store.contacts.map(contact => (
					<ContactCard key={contact.id} contact={contact} onDelete={() => deleteContact(contact.id)} />
				))}
			</div>
		</div>
	)
}

export default Home