class Article
{
    public function getImagePath()
    {
        return 'uploads/article_image/'.$this->getImageFilename();
    }
}