const Logo = ({className = ''}) => (
  <div className="flex justify-center items-end">
    <img src="/uca-logo.png" className="h-10 w-10 mr-2" alt="UCA" />
    <div className={`text-lg font-bold ${className}`}>
      <span className="text-primary">Vive la UCA</span>
    </div>
  </div>
);

export default Logo;
