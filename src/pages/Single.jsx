// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
  const { store } = useGlobalReducer()
  const { theId } = useParams()
  const id = parseInt(theId)
  const contact = store.contacts.find(c => c.id === id)

  if (!contact) return (
    <div className="container mt-4">
      <div className="alert alert-warning">Contact not found</div>
      <Link to="/" className="btn btn-primary">Back</Link>
    </div>
  )

  return (
    <div className="container mt-4">
      <h2>{contact.full_name}</h2>
      <p><strong>Email:</strong> {contact.email}</p>
      <p><strong>Phone:</strong> {contact.phone}</p>
      <p><strong>Address:</strong> {contact.address}</p>
      <Link to="/" className="btn btn-secondary">Back to contacts</Link>
    </div>
  )
}

export default Single
