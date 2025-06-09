import { useEffect, useState,useRef } from "react";
import { Menu } from "lucide-react";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SearchIcon from '@mui/icons-material/Search';
import Fuse from 'fuse.js';

type NavLink = {
  id: string;
  label: string;
};

interface NavbarProps {
  navLinks: NavLink[];
}

interface Fruit {
  name: string;
}

const sampleData: Fruit[] = [
  { name: 'Apple' },
  { name: 'Orange' },
  { name: 'Banana' },
  { name: 'Grapes' },
  { name: 'Watermelon' },
];

const fuse = new Fuse<Fruit>(sampleData, {
  keys: ['name'],
  threshold: 0.4,
});

function Navbar({navLinks}:NavbarProps){

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Fruit[]>([]);
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [active,setActive] = useState<string>('home');
    const [userMouseActive,setUserMouseActive] = useState<boolean>(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [searchActive,setSearchActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);


    useEffect( ()=>{
        const handleEsc = (e:KeyboardEvent)=>{

            if (e.key === 'Escape') setIsOpen(false);
        };

        if (searchTerm.trim() === '') {
            
        } else {
            const res = fuse.search(searchTerm);
            setResults(res.map(r => r.item));
        }

        window.addEventListener('keydown',handleEsc);
        return () => window.removeEventListener('keydown',handleEsc);
    },[searchTerm])

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        }
        setUserMouseActive(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
        setUserMouseActive(false);
        }, 300); // 300ms sonra kapat
    };

    return(
        <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="relative flex justify-between items-center h-13">

                <div className="flex-1 absolute left-15
                transition-all duration-300">
                    <a href="/" className="text-2xl font-bold text-gray-800 ml-5">Navbar</a>
                </div>

                {/* Desktop Menu */}
                <ul
                className={`hidden md:flex absolute transform transition-all duration-300 left-1/2 -translate-x-1/2 space-x-6 text-center flex-1`}
                >
                    {navLinks.map( (link)=> (
                        <li key={link.id}>
                            <a
                            href={`#${link.id}`}
                            onClick={ ()=> {
                                setActive(link.id);
                             } }
                            className={`transition`}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>


                <div className="hidden md:flex gap-6 items-center absolute left-3/4 transform -translate-x-1/4">

                    {/*Search Icon*/}
                    <div className="relative w-8 md:w-60 transition-all duration-300">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            className={`transition-all mt-1 duration-300 ease-in-out px-3 py-1 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-600 bg-white text-sm
                            ${searchActive ? 'translate-x-0 w-60 opacity-100 scale-100' : 'translate-x-5 w-0 opacity-0 cursor-pointer w-60 scale-90'}`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onFocus={() => {
                                setSearchActive(true);
                                setIsFocused(true);
                            }}
                            onBlur={() => {
                                setSearchActive(false);
                                setIsFocused(false);
                            }}
                        />
                        {isFocused && ( 
                            <ul className={`absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-md max-h-48 overflow-y-auto`}> 
                            {results.length === 0 && searchTerm.trim() !== '' ? (
                                <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    There is nothing.
                                </li>
                            ) : ( 
                            results.map((item, idx) => (
                                <li
                                key={idx}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                onMouseDown={() => {
                                    setSearchTerm(item.name);
                                    setIsFocused(false);
                                }}
                                >
                                {item.name}
                                </li>
                            )))} 

                            </ul>
                        )}
                        
                        {!searchActive && (
                            <SearchIcon
                            onClick={() =>{
                                setSearchActive(true);
                                setTimeout(() => inputRef.current?.focus(), 10);
                            }}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
                            fontSize="small"
                            />
                        )}
                    </div>

                    {/* Personal Icon */}
                    <div onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave} 
                    className={`relative`}>
                        <PersonOutlineIcon className="cursor-pointer" />
                        
                        <ul className={`absolute left-1/2 top-full transform -translate-x-1/2 bg-white rounded-xl p-2 border border-gray-200 mt-1 space-y-2 pb-3 text-gray-700 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${userMouseActive ? "max-h-40 opacity-100 px-2" : "max-h-0 opacity-0 px-4"}`} style={{ width: '160px' }}>
                            <li className="flex items-center py-1 gap-2 hover:bg-gray-100 px-2 rounded cursor-pointer">
                                <PersonOutlineIcon fontSize={"small"} className="cursor-pointer mx-1" />
                                <span>User infos</span>
                            </li>
                            <li className="flex items-center py-1 gap-2 hover:bg-gray-100 px-2 rounded cursor-pointer">
                                <LogoutIcon fontSize={"small"} className="cursor-pointer mx-1" />
                                <span>Logout</span>
                            </li>
                        </ul>
                    </div>

                    {/*Shooping Basket */}
                    <ShoppingBasketIcon fontSize="small" className="cursor-pointer" />
                </div>

                {/* Mobile Menu Button*/}
                <div className="flex justify-end md:hidden transition">
                    <button onClick={ () => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                    className="text-gray-800 px-5"
                    >
                        <Menu size={28}/>
                    </button>
                </div>
            </div>


            {/* Mobile Menu */}
            <ul className={`md:hidden bg-white px-5 space-y-2 font-medium text-gray-700 transition-all duration-600 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                {navLinks.map( (link)=> (
                    <li key={link.id}>
                        <a
                        href={`#${link.id}`}
                        onClick={ ()=> {
                            setActive(link.id)
                            setIsOpen(false);
                        }}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;