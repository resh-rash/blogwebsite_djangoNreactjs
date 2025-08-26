import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBlogDetail } from '../../api/api';
import {Menu} from '../../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import CategoryList from './categorylist';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';



const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // comment ID
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");

  useEffect(() => {
    fetchBlogDetail(slug)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));

    // Fetch related blogs
    fetch(`http://localhost:8000/api/blog/${slug}/related/`)
      .then((res) => res.json())
      .then((data) => setRelatedBlogs(data));

    //Fetch comments
    fetch(`http://localhost:8000/api/blog/${slug}/comments/`)
    .then(res => res.json())
    .then(data => setComments(data));

     // Clean up popovers on component unmount
    return () => {
      const popovers = document.querySelectorAll('.popover');
      popovers.forEach(p => p.remove());
    };
  }, [slug]);


  if (relatedBlogs){
      console.log("blogdetailpage: relatedblog is:", relatedBlogs)
  };

  const formatDate = (dateString) => {  //To convert the datetime into dd/mm/yyyy hh:mm AM/PM
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCategoryClick = (category) => {
    // console.log("blogdetail, category click:", category)
    navigate(`/blogs?category=${category}`);
  };

  const AuthorPopover = ({ author, designation, about }) => (
    <OverlayTrigger
      placement="bottom"  //default trigger="['hover', 'focus']"
      overlay={
        <Popover>
          <Popover.Header as="h3">{author} ({designation})</Popover.Header>
          <Popover.Body>
            {about}
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="link" style={{color: '#51260d'}}>{author}</Button>
    </OverlayTrigger>
  );

  const handleCommentSubmit = async (e) => {
    e.preventDefault();  // Prevents page reload
    const res = await fetch(`http://localhost:8000/api/blog/${slug}/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text: commentText })  // Send new comment
    });
    if (res.ok) {
      const newComment = await res.json();  // Get the newly created comment
      setComments([...comments, newComment]);  // Add it to existing comments
      setName('');
      setCommentText('');  // Clear the form fields
    }
  };

  const handleReplySubmit = async (commentId) => {
    const res = await fetch(`http://localhost:8000/api/blog/${slug}/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: replyName, text: replyText, parent: commentId, })  // parent ID makes it a reply
    });
    if (res.ok) {
      const replyComment = await res.json();  // Get the newly created reply
      // Deep copy of comments to avoid direct mutation
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          // If this is the parent comment, add reply under it
          const updatedReplies = comment.replies ? [...comment.replies, replyComment] : [replyComment];
          return { ...comment, replies: updatedReplies };
        } else {
          return comment;
        }
      });
      setComments(updatedComments);  
      setReplyingTo(null);
      setReplyText("");
      setReplyName("");
    }
  };
    
  if (!blog) return <p>Loading blog...</p>;

  return (
    <Container fluid style={{ minHeight: '700px' }}>
        <Menu/>
        <Row className='body' style={{marginTop:'90px'}}> 
          <Col md={1}></Col>     {/* Empty spacer column */}
          <Col md={9}>
          <Row>
            <h2>{blog.title}</h2>
            <p style={{color: '#51260d'}}><AuthorPopover author={blog.author} designation={blog.auth_designation} about={blog.auth_about}/>| {new Date(blog.created_at).toLocaleDateString('en-CA')}</p> {/*to print only the date part in yyyy-mm-dd format*/}

            
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div>
                {blog.images.map((img, index) => {
                    return(
                    <img
                        key={index}
                        src={img.image}
                        alt={`blog-${index}`}
                        width="300"
                        style={{ margin: '10px 0' }}
                    />
                    )
                  })    
                }
            </div>
          </Row>
          <br/>
          <Row>
            <hr></hr>
            <div>
              <h6>Related Blogs:</h6>
              <Row className="g-3"> {/*Wrapped all <Col> elements inside <Row> Enables horizontal alignment. 'g-3' adds horizontal gutter spacing*/}
              {relatedBlogs.length > 0 ? (
                <> 
                {/*'<>' is a shorthand for <React.Fragment> ... </React.Fragment>. 
                It's used here to return multiple <Col> elements without wrapping them in an extra <div> or similar. */}
                {relatedBlogs.map((related, index) => (
                <Col key={index} md={3} className="border p-3 rounded mb-3 me-3 shadow-sm">
                  <Button variant='link' onClick={() => navigate(`/blog/${related.slug}`)}>{related.title}</Button>
                </Col>
                ))}
                </>):(<p>No related Blogs!</p>)}
              </Row>
            </div>
          </Row>
          <Row>
            <hr></hr>
            <h6>Comments:</h6>
            <Form onSubmit={handleCommentSubmit} className="border p-3 rounded shadow-sm">
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant='success' size='sm' type="submit">Submit</Button>
            </Form>
          </Row>
          <Row>
            <div className="mt-4">
              {comments.map(comment => (
                <div key={comment.id} className="mb-3 border-bottom pb-2">
                  <strong>{comment.name}</strong> <br />
                  <span style={{fontSize:'12px', color:'GrayText'}}>{formatDate(comment.created_at)}</span><br/>
                  <span>{comment.text}</span>
                  <Button variant='link' onClick={() => setReplyingTo(comment.id)}>Reply</Button>

                  {/* Render reply form only for the selected comment */}
                  {replyingTo === comment.id && (
                    <Form className="border p-3 mt-2 rounded shadow-sm">
                      <Form.Group className="mb-1" controlId="replyName">
                        <Form.Control
                          type="text"
                          placeholder="Your name"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-1" controlId="replyText">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                      </Form.Group>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleReplySubmit(comment.id)}
                      >
                        Submit Reply
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                    </Form>
                  )}

                  {comment.replies.length > 0 && (
                    <div className="mt-2 ps-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-light p-2 rounded mb-1">
                          <strong>{reply.name}</strong> <span style={{fontSize:'12px', color:'GrayText'}}>({formatDate(comment.created_at)})</span> : {reply.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Row>
          </Col>

          <Col md={2}>
            <CategoryList handleCategoryClick={handleCategoryClick}/>
          </Col>
        </Row>
    </Container>
  );
};

export default BlogDetail;
