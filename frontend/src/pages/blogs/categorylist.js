import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../api/api';
import {Container} from 'react-bootstrap';
import '../../styles/style.css';


const CategoryList = ({handleCategoryClick, selectedCategory}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => { 
        fetchCategories()
            .then(res => setCategories(res.data));
        }, []);

    return(
        <Container fluid style={{ minHeight: '700px' }}>
            <h5 style={{textAlign:'center'}}>Categories</h5>
            {categories.map((category, idx=0) => (
                <button
                    key={idx}
                    className={`category-button my-1 me-1 w-40 ${
                        selectedCategory === category.id ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                >
                {category.category}
                </button>
            ))}
        </Container>
    );

};

export default CategoryList;