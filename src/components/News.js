import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const updateNews=async()=> {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(50);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)

    props.setProgress(100);
  }
  useEffect(() => {
    document.title = `${Capitalize(props.category)}- NewsMonkey`;
    //eslint-disable-next-line
    updateNews();
  }, [])

  // handlePrevClick=async()=>{
  //    setPage(page-1)
  //   updateNews();
  // }
  // handleNextClick=async()=>{ 
  //    setPage(page+1)
  //   updateNews();
  // }

  const fetchMoreData = async () => {
    setPage(page+1)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=95dd16e06bd443948055fadc7f828a48&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

    return (
      <>
        <h1 className="text-center" style={{ margin: "35px" ,marginTop:"90px"}}>
          NewsMonkey - Top {Capitalize(props.category)} headlines
        </h1>
        {/* {state.loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !==totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
}

export default News;

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.PropType = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};



  /* <div className="container d-flex justify-content-between">
        <button disabled={page<=1} type="button" className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
        <button disabled={page + 1 > Math.ceil(totalResults/props.pageSize)}type="button" className="btn btn-dark"  onClick={handleNextClick}>Next &rarr;</button>
        </div> */

