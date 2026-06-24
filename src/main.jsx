import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Addnotes from "./components/Addnotes"
import Notes from "./components/Notes"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Layout from "./components/Layout"

// protects routes — redirects to login if not logged in
const ProtectedRoute = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    return user ? children : <Navigate to='/login' />
}

const PageShell = ({ children, title }) => (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#faf9ff 0%,#f5f3ff 50%,#ecfdf5 100%)', padding: '40px 20px', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', background: 'linear-gradient(135deg,#a78bfa,#34d399,#fda4af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px', letterSpacing: '-0.04em' }}>{title}</h1>
            {children}
        </div>
    </div>
)

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            {
                path: 'addnotes',
                element: (
                    <ProtectedRoute>
                        <PageShell title="Add a Note"><Addnotes /></PageShell>
                    </ProtectedRoute>
                )
            },
            {
                path: 'viewnotes',
                element: (
                    <ProtectedRoute>
                        <PageShell title="My Notes"><Notes /></PageShell>
                    </ProtectedRoute>
                )
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)