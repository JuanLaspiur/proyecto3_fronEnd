import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Pagination = ({ pageNumber, updatePageNumber, totalCount, pageSize }) => {
  let pages = 1;
  if (totalCount > pageSize) {
    pages = Math.ceil(totalCount / pageSize);
  }
  const [width, setWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  let pageChange = (data) => {
    updatePageNumber(data.selected + 1);
  };
  const prev = <ArrowBackIosNewIcon />;
  const next = <ArrowForwardIosIcon />;

  return (
    <>
      <ReactPaginate
        className="reactPaginate"
        nextLabel={next}
        previousLabel={prev}
        forcePage={pageNumber === 1 ? 0 : pageNumber - 1}
        marginPagesDisplayed={width < 576 ? 1 : 2}
        pageRangeDisplayed={width < 576 ? 1 : 2}
        pageCount={pages}
        onPageChange={pageChange}
        previousClassName="previousPag"
        previousLinkClassName="previousLinkPag"
        nextClassName="nextPag"
        nextLinkClassName="nextLinkPag"
        breakClassName="breakPag"
        activeClassName="activePag"
        pageClassName="pagePag"
        pageLinkClassName="pageLinkPag"
      />
    </>
  );
};

export default Pagination;
