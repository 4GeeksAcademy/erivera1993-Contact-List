import React from "react";
import { Link } from "react-router-dom";
import fallbackImg from "../assets/img/1edc1d8c7d71486e7e35e47aa53fa5d03b0de82fd5c710d2972d598f97c379eb.png";

export default function ContactCard({ contact, onDelete }) {
  const { id, full_name, email, phone, address } = contact;

  return (
    <div className="list-group-item d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <img src={contact.image || fallbackImg} alt="avatar" className="contact-avatar" />
        <div>
          <h5 className="mb-1">{full_name || 'No name'}</h5>
          <div className="text-muted small">
            <div><i className="fa fa-map-marker" /> {address}</div>
            <div><i className="fa fa-phone" /> {phone}</div>
            <div><i className="fa fa-envelope" /> {email}</div>
          </div>
        </div>
      </div>

      <div>
        <Link to={`/edit/${id}`} className="btn btn-outline-secondary btn-sm me-2" title="Edit">
          <i className="fa fa-pencil" />
        </Link>
        <button className="btn btn-outline-danger btn-sm" onClick={() => { if (confirm('Delete this contact?')) onDelete() }} title="Delete">
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  )
}
