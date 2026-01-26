export default function Button({children, onClick, className = '', ...props}){
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-md bg-primary-600 text-white ${className}`} {...props}>
      {children}
    </button>
  )
}
