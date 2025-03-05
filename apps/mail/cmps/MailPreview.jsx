const { Link, useSearchParams, useNavigate } = ReactRouterDOM

export function MailPreview({ mail, onMailClick, onToggleStar, onToggleSelect, onDeleteMail, onEditDraft, selectedMails = [] }) {
    const [searchParams] = useSearchParams()
    const folder = searchParams.get('folder') || 'inbox'
    const navigate = useNavigate()

    function formatMailDate(mail) {
        const timestamp = mail.sentAt || mail.createdAt; // ✅ Use createdAt if sentAt is missing
        if (!timestamp) return "Draft"; // ✅ Handle missing date gracefully

        const date = new Date(timestamp);
        const now = new Date();
        const isToday = now.toDateString() === date.toDateString();

        return isToday
            ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) // ✅ Show time if today
            : date.toLocaleDateString([], { month: "short", day: "numeric" }); // ✅ Show date if older
    }


    let displayFrom;
    if (folder === "sent") {
        displayFrom = `To: ${mail.to}`; // ✅ Show "To: [recipient]"
    } else if (folder === "drafts") {
        displayFrom = "Draft"; // ✅ Show "Draft"
    } else {
        displayFrom = mail.from; // ✅ Show normal sender in other folders
    }

    function handleClick(ev) {
        if (ev.target.type === "checkbox") return
        ev.preventDefault()
        if (mail.folder === "drafts") {
            onEditDraft(mail.id)
        } else {
            navigate(`/mail/${mail.id}?folder=${folder}`)
        }
    }

    return (
        <div onClick={handleClick} className={`mail-preview ${mail.isRead ? "read" : "unread"} ${selectedMails.includes(mail.id) ? "selected" : ""} ${mail.isStarred ? "starred" : ""}`}>
            <div className='tooltip-btn'>
            <input
                type="checkbox"
                checked={selectedMails.includes(mail.id)}
                onChange={() => onToggleSelect(mail.id)}
            />
            <span className="tooltip-text">Select</span>
            </div>

            <div className='tooltip-btn'>
                <i
                    className={`fa-star ${mail.isStarred ? "fas" : "far"}`}

                    onClick={(ev) => {
                        ev.stopPropagation()
                        onToggleStar(mail.id)
                    }}
                ></i>
                <span className="tooltip-text">{mail.isStarred ? "Starred" : "Not starred"}</span>
            </div>

            {/* ✅ If draft → Open pop-up, If not → Navigate normally */}
            {mail.folder === "drafts" ? (
                <div className="mail-text-wrapper" onClick={() => onEditDraft(mail.id)}>
                    <h3 className="draft-label" style={{ color: "red", fontWeight: "normal" }}>Draft</h3>
                    <div className="mail-text">
                        <p className={mail.isRead ? "" : "bold"}>
                            {mail.subject} <span className="mail-body"> - ... {mail.body.substring(0, 50)}</span>
                        </p>
                    </div>
                </div>
            ) : (
                <Link to={`/mail/${mail.id}?folder=${folder}`} className="mail-link">
                    <h3 className={mail.isRead ? "" : "bold"}>
                        {mail.folder === "sent" ? `To: ${mail.to}` : mail.from}
                    </h3>
                    <div className="mail-text-wrapper">
                        <div className="mail-text">
                            <p className={mail.isRead ? "" : "bold"}>
                                {mail.subject} <span className="mail-body"> - ... {mail.body.substring(0, 50)}</span>
                            </p>
                        </div>
                    </div>
                </Link>
            )}

            <div className="mail-actions-wrapper">
                <span className="mail-date">
                    {formatMailDate(mail)}
                </span>
                <div className="mail-actions">
                    <div className='tooltip-btn'>
                    <i className={mail.isRead ? "fa-regular fa-envelope" : "fa-regular fa-envelope-open"}
                            onClick={(ev) => {
                                ev.stopPropagation()
                                onMailClick(mail.id)
                            }}
                        ></i>
                        <span className="tooltip-text">{mail.isRead ? "Mark as Unread" : "Mark as Read"}</span>
                    </div>
                    <div className='tooltip-btn'>
                    <i className="fa-regular fa-trash-can" onClick={(ev) => {
                        ev.stopPropagation()
                        onDeleteMail(mail.id)
                    }}></i>
                    <span className="tooltip-text">Delete</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
