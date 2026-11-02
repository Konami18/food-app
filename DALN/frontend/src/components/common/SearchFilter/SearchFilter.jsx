
import React, { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [ratingFilter, setRatingFilter] = useState('all');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters({ searchTerm: value, sortBy, priceRange, ratingFilter });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        applyFilters({ searchTerm, sortBy: value, priceRange, ratingFilter });
    };

    const handlePriceChange = (type, value) => {
        const newPriceRange = { ...priceRange, [type]: value };
        setPriceRange(newPriceRange);
        applyFilters({ searchTerm, sortBy, priceRange: newPriceRange, ratingFilter });
    };

    const handleRatingChange = (e) => {
        const value = e.target.value;
        setRatingFilter(value);
        applyFilters({ searchTerm, sortBy, priceRange, ratingFilter: value });
    };

    const applyFilters = (filters) => {
        onFilterChange(filters);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSortBy('default');
        setPriceRange({ min: '', max: '' });
        setRatingFilter('all');
        onFilterChange({
            searchTerm: '',
            sortBy: 'default',
            priceRange: { min: '', max: '' },
            ratingFilter: 'all'
        });
    };

    return (
        <div className='search-filter'>
            <div className='search-bar'>
                <input
                    type='text'
                    placeholder='Tìm kiếm món ăn, ẩm thực, nhà hàng...'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <span className='search-icon'>🔍</span>
            </div>

            <div className='filter-options'>
                <div className='filter-group'>
                    <label>Sắp xếp theo:</label>
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value='default'>Mặc định</option>
                        <option value='price-low'>Giá: Từ thấp đến cao</option>
                        <option value='price-high'>Giá: Từ cao đến thấp</option>
                        <option value='name-asc'>Tên: A đến Z</option>
                        <option value='name-desc'>Tên: Z đến A</option>
                        <option value='rating'>Đánh giá cao nhất</option>
                    </select>
                </div>

                <div className='filter-group'>
                    <label>Khoảng giá:</label>
                    <div className='price-range-inputs'>
                        <input
                            type='number'
                            placeholder='Giá thấp nhất'
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type='number'
                            placeholder='Giá cao nhất'
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                        />
                    </div>
                </div>

                <div className='filter-group'>
                    <label>Đánh giá:</label>
                    <select value={ratingFilter} onChange={handleRatingChange}>
                        <option value='all'>Tất cả đánh giá</option>
                        <option value='4'>Từ 4★ trở lên</option>
                        <option value='3'>Từ 3★ trở lên</option>
                        <option value='2'>Từ 2★ trở lên</option>
                    </select>
                </div>

                <button className='clear-filters-btn' onClick={clearFilters}>
                    Xóa bộ lọc
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
