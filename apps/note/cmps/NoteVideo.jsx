export function NoteVideo({ info }) {
    // Extract video ID from YouTube URL
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null
        
        // Handle different YouTube URL formats
        let videoId = null
        
        // Standard YouTube URL format: https://www.youtube.com/watch?v=VIDEO_ID
        const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
        if (standardMatch && standardMatch[1]) {
            videoId = standardMatch[1]
        }
        
        // Embedded URL format: https://www.youtube.com/embed/VIDEO_ID
        const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/)
        if (embedMatch && embedMatch[1]) {
            videoId = embedMatch[1]
        }
        
        if (!videoId) return null
        
        return `https://www.youtube.com/embed/${videoId}`
    }
    
    const embedUrl = getYoutubeEmbedUrl(info.url)
    
    if (!embedUrl) {
        return (
            <div className="note-video-error">
                <p>Invalid YouTube URL. Please provide a valid YouTube video link.</p>
                <p className="note-url">{info.url}</p>
            </div>
        )
    }
    
    return (
        <div className="note-video">
            {info.title && <h3>{info.title}</h3>}
            <div className="video-container">
                <iframe
                    src={embedUrl}
                    title={info.title || "YouTube video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
            </div>
        </div>
    )
}