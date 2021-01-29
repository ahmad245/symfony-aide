class ArticleAdminController extends BaseController
{
    public function edit(Article $article, Request $request, EntityManagerInterface $em)
    {
        if ($form->isSubmitted() && $form->isValid()) {

            if ($uploadedFile) {
                    //dd($form['imageFile']->getData());


                    /** @var UploadedFile $uploadedFile */
                    $uploadedFile = $form['imageFile']->getData();
                    $destination = $this->getParameter('kernel.project_dir').'/public/uploads/article_image';


                    $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $newFilename = Urlizer::urlize($originalFilename).'-'.uniqid().'.'.$uploadedFile->guessExtension();
                    $uploadedFile->move(
                        $destination,
                        $newFilename
                    );

                    $article->setImageFilename($newFilename);

            }
        }
    }
}