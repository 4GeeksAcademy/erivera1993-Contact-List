import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import useGlobalReducer, { useContacts } from '../hooks/useGlobalReducer'

export default function AddContact(){
  const { theId } = useParams()
  const navigate = useNavigate()
  const { store } = useGlobalReducer()
  const { createContact, updateContact } = useContacts()

  const editing = typeof theId !== 'undefined'

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    if (editing) {
      const id = parseInt(theId)
      const contact = store.contacts.find(c => c.id === id)
      if (contact) setForm({ full_name: contact.full_name || '', email: contact.email || '', phone: contact.phone || '', address: contact.address || '' })
    }
  }, [editing, theId, store.contacts])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (editing) {
      await updateContact(parseInt(theId), payload)
    } else {
      await createContact(payload)
    }
    navigate('/')
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">{editing ? 'Edit contact' : 'Add a new contact'}</h2>
      <form onSubmit={onSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input name="full_name" value={form.full_name} onChange={onChange} className="form-control" placeholder="Full Name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" value={form.email} onChange={onChange} className="form-control" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="form-control" placeholder="Enter phone" />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input name="address" value={form.address} onChange={onChange} className="form-control" placeholder="Enter address" />
        </div>

        <div className="d-flex align-items-center">
          <button className="btn btn-primary w-100" type="submit">save</button>
        </div>

        <div className="mt-3">
          <Link to="/">or get back to contacts</Link>
        </div>
      </form>
    </div>
  )
}
