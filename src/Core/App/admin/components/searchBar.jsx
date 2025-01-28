import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="form-control flex-1">
          <div className="input-group">
            <input
              type="text"
              placeholder="Buscar por cédula o correo..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-primary"
              type="submit"
            >
              <FaSearch className="mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;