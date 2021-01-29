// src/Controller/ProductController.php
namespace App\Controller;

use App\Service\FileUploader;
use Symfony\Component\HttpFoundation\Request;

// ...
public function new(Request $request, FileUploader $fileUploader)
{
    // ...

    if ($form->isSubmitted() && $form->isValid()) {
        /** @var UploadedFile $brochureFile */
        $brochureFile = $form->get('brochure')->getData();
        if ($brochureFile) {
            $brochureFileName = $fileUploader->upload($brochureFile);
            $product->setBrochureFilename($brochureFileName);
        }

        // ...
    }

    // ...
}