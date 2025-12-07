// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useCallback } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext)
    return { dispatch, store };
}

// Helper hook that exposes CRUD operations for contacts using the API and the global reducer.
export function useContacts() {
    const { dispatch, store } = useContext(StoreContext)

    const API_BASE = "https://assets.breatheco.de/apis/fake/contact";

    const fetchContacts = useCallback(async () => {
        try {
            const res = await fetch(API_BASE + "/contact/", { method: 'GET' })
            const data = await res.json()
            dispatch({ type: 'set_contacts', payload: data })
            return data
        } catch (error) {
            dispatch({ type: 'set_message', payload: 'Failed to load contacts' })
            return []
        }
    }, [dispatch])

    const createContact = useCallback(async (contact) => {
        // Ensure an agenda_slug is sent to the API. Change this if you want a different agenda.
        const payload = { ...contact, agenda_slug: '4geeks_agenda' }
        try {
            const res = await fetch(API_BASE + "/contact/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            // If the API responds with JSON and an id, use it; otherwise fall back to optimistic local add
            let data = null
            try { data = await res.json() } catch (e) { data = null }

            if (res.ok && data && data.id) {
                dispatch({ type: 'add_contact', payload: data })
                return data
            }

            // Fallback: create a local contact (optimistic) when API doesn't return proper response
            const local = { ...payload, id: Date.now() }
            dispatch({ type: 'add_contact', payload: local })
            return local
        } catch (error) {
            // On network error, still add locally so UX remains functional
            const local = { ...payload, id: Date.now() }
            dispatch({ type: 'add_contact', payload: local })
            dispatch({ type: 'set_message', payload: 'Failed to create contact on server — saved locally' })
            return local
        }
    }, [dispatch, fetchContacts])

    const updateContact = useCallback(async (id, contact) => {
        const payload = { ...contact, agenda_slug: '4geeks_agenda' }
        try {
            const res = await fetch(`${API_BASE}/contact/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            let data = null
            try { data = await res.json() } catch (e) { data = null }
            if (res.ok && data && data.id) {
                dispatch({ type: 'update_contact', payload: data })
                return data
            }

            // Fallback: update locally
            const local = { ...payload, id }
            dispatch({ type: 'update_contact', payload: local })
            return local
        } catch (error) {
            const local = { ...payload, id }
            dispatch({ type: 'update_contact', payload: local })
            dispatch({ type: 'set_message', payload: 'Failed to update contact on server — updated locally' })
            return local
        }
    }, [dispatch, fetchContacts])

    const deleteContact = useCallback(async (id) => {
        try {
            await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE' })
            dispatch({ type: 'delete_contact', payload: id })
            return true
        } catch (error) {
            dispatch({ type: 'set_message', payload: 'Failed to delete contact' })
            return false
        }
    }, [dispatch])

    return { store, fetchContacts, createContact, updateContact, deleteContact }
}