import {checkIsEscapeKey, checkIsMouseClick, toggleClass} from './utils.js';

const COMMENTS_SHOWEN = 5;

const bigPicElement = document.querySelector('.big-picture');
const bigPicCloseButtonElement = bigPicElement.querySelector('.big-picture__cancel');
const bigPicImgElement = bigPicElement.querySelector('.big-picture__img img');
const bigPicLikesCountElement = bigPicElement.querySelector('.likes-count');
const bigPicCommentsCountElement = bigPicElement.querySelector('.comments-count');
const bigPicCaptionElement = bigPicElement.querySelector('.social__caption');
const bigPicCommentsElement = bigPicElement.querySelector('.social__comments');
const bigPicCommentsLoaderElement = bigPicElement.querySelector('.social__comments-loader');
const bigPicShowenCommentsCountElement = bigPicElement.querySelector('.social__comment-count');


let shownCommentsCount = 0;
let totalCommentList = [];
let totalCommentListLength = 0;

const fillBigPicComments = (comments) => {
  bigPicCommentsElement.innerHTML = '';

  const commentsList = comments.reduce((accumulator, currentComment) => {
    shownCommentsCount++;
    accumulator += `<li class="social__comment ${shownCommentsCount > COMMENTS_SHOWEN ? 'hidden' : ''}">
      <img class="social__picture" src="${currentComment.avatar}" alt="${currentComment.name}" width="35" height="35">
      <p class="social__text">${currentComment.message}</p>
    </li>`;
    return accumulator;
  }, '');

  bigPicCommentsElement.insertAdjacentHTML('beforeend', commentsList);
};

const fillCommentsCount = () => {
  bigPicShowenCommentsCountElement.innerHTML = `${shownCommentsCount} из <span class="comments-count">${totalCommentListLength}</span> ${totalCommentListLength === 1 ? 'комментария': 'комментариев'}`;
  if(shownCommentsCount === totalCommentListLength) {
    bigPicCommentsLoaderElement.classList.add('hidden');
  }
};

const renderBigPic = ({url, likes, description, comments}) => {
  bigPicImgElement.src = url;
  bigPicLikesCountElement.textContent = likes;
  bigPicCommentsCountElement.textContent = comments.length;
  bigPicCaptionElement.textContent = description;

  fillBigPicComments(comments);
  shownCommentsCount = totalCommentListLength < COMMENTS_SHOWEN ? totalCommentListLength : COMMENTS_SHOWEN;
  fillCommentsCount();
};

const loadMoreCommentHandler = () => {
  const bigPicComment = bigPicCommentsElement.querySelectorAll('.social__comment.hidden');
  const commentsForShowCount = bigPicComment.length < COMMENTS_SHOWEN ? bigPicComment.length : COMMENTS_SHOWEN;
  shownCommentsCount += commentsForShowCount;
  for (let i=0; i < commentsForShowCount; i++) {
    bigPicComment[i].classList.remove('hidden');
  }
  fillCommentsCount();
};

const tooglePictureModal = (isHidden) => {
  toggleClass(bigPicElement, 'hidden', !isHidden);
  toggleClass(document.body, 'modal-open', isHidden);
  bigPicCommentsElement.innerHTML = '';
};

const closeBigPicModal = (evt) => {
  evt.preventDefault();
  if (checkIsEscapeKey(evt) || checkIsMouseClick(evt)) {
    tooglePictureModal(false);
    document.removeEventListener('keydown', closeBigPicModal);
    bigPicCloseButtonElement.removeEventListener('click', closeBigPicModal);
    bigPicCommentsLoaderElement.removeEventListener('click', loadMoreCommentHandler);
    shownCommentsCount = 0;
    bigPicCommentsLoaderElement.classList.remove('hidden');
  }
};

const openBigPicModal = (element) => {
  bigPicCommentsLoaderElement.addEventListener('click', loadMoreCommentHandler);
  totalCommentList = element.comments;
  totalCommentListLength = totalCommentList.length;
  tooglePictureModal(true);
  renderBigPic(element);
  document.addEventListener('keydown', closeBigPicModal);
  bigPicCloseButtonElement.addEventListener('click', closeBigPicModal);
};

export {openBigPicModal};
