
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((previous, current) => previous + current.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((previous, current) => {
    if(current.likes > previous.likes) {
      return current
    } else {
      return previous
    }
  }, { likes: 0 }
  )
}

const mostBlogs = (blogs) => {
  
  const reducer = (accum, curr) => {
    if(!accum.includes(curr.author))
      return accum.concat(curr.author)
    else
      return accum
  }

  // collect bloggers
  const bloggers = blogs.reduce(reducer, [])

  //blogs per author
  const blogAmount = (author, blogList) => {
    return blogList.reduce(
      (accum, curr) => {
        if(curr.author === author) {
          return accum + 1
        } else {
          return accum
        }
      }, 0
    )
  }

  // most blogs and amount
  return bloggers.reduce(
    (accum, current) => {
      const currentBlogAmount = blogAmount(current, blogs)
      if(accum.blogAmount < currentBlogAmount) {
        return { author: current, blogAmount: currentBlogAmount }
      } else {
        return accum
      }
    }, { author: 'none', blogAmount: 0 }
  )
}

const mostLikes = (blogs) => {
  const reducer = (accum, curr) => {
    if(!accum.includes(curr.author))
      return accum.concat(curr.author)
    else
      return accum
  }

  // collect bloggers
  const bloggers = blogs.reduce(reducer, [])

  //likes per author
  const likes = (author, blogList) => {
    return blogList.reduce(
      (accum, curr) => {
        if(curr.author === author) {
          return accum + curr.likes
        } else {
          return accum
        }
      }, 0
    )
  }

  // most blogs and amount
  return bloggers.reduce(
    (accum, current) => {
      const currentLikes = likes(current, blogs)
      if(accum.likes < currentLikes) {
        return { author: current, likes: currentLikes }
      } else {
        return accum
      }
    }, { author: 'none', likes: 0 }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}