import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './MovieCards.css'

import { Link } from 'react-router-dom';

function MovieCards({ movieList }) {
    return (
        <Container>
            <Row className="flex-nowrap overflow-auto">
                {movieList.map((movie) => (
                    <Col key={movie.id} xs="auto">
                        <Card className="movie-card-container">
                            <Card.Img 
                                variant="top" 
                                src={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`} 
                                alt={`${movie.title} poster`} 
                                className="movie-card-image"
                            />
                            <Card.Body>
                                <Card.Title className="movie-card-title">
                                    {movie.title}
                                </Card.Title>
                                <Card.Text className="movie-card-text">
                                    {movie.overview.slice(0, 50)}...
                                </Card.Text>
                                <Link to={`/movie/${movie.id}`}>
                                    <Button className="movie-card-button" variant="primary" size="sm">
                                        Go somewhere
                                    </Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MovieCards;
