const { useState, useEffect } = React
import { eventBusService } from '../services/event-bus.service.js'

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    
    useEffect(() => {
        
        const removeListener = eventBusService.on('show-user-msg', (msg) => {
            setMsg(msg)
            setTimeout(() => {
                setMsg(null)
            }, 3000)
        })
        
       
        return () => {
            removeListener()
        }
    }, [])
    
    if (!msg) return null
    
    return (
        <div className={`user-msg ${msg.type}`}>
            <span>{msg.txt}</span>
            <button onClick={() => setMsg(null)}>×</button>
        </div>
    )
}