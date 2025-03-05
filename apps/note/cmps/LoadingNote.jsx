const { useState, useEffect } = React
let hasShownAnimation = false

export function LoadingAnimation() {
    const [isVisible, setIsVisible] = useState(true)
    const [useSimpleLoader, setUseSimpleLoader] = useState(hasShownAnimation)
    
    useEffect(() => {
        if (!hasShownAnimation) {
            hasShownAnimation = true
   
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 5000)
            
            return () => clearTimeout(timer)
        } else {
         
            return () => {}
        }
    }, [])
    
    if (!isVisible) return null
    
    if (useSimpleLoader) {
        return (
            <div className="simple-loading">
                Loading...
            </div>
        )
    }
    
    return (
        <div className="loading">
            <iframe 
                src="https://lottie.host/embed/394b5b40-ca0a-4b55-b8c7-3b53832df473/4fR66BlS7h.lottie" 
                title="Loading animation"
                style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    borderRadius: 0,
                    boxShadow: "none",
                    width: "200px",
                    height: "200px"
                }}
            />
        </div>
    )
}