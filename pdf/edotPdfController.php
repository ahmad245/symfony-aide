use Symfony\Component\HttpFoundation\File\File;
// ...

$product->setBrochureFilename(
    new File($this->getParameter('brochures_directory').'/'.$product->getBrochureFilename())
);