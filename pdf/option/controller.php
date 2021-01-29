use Symfony\Component\HttpFoundation\BinaryFileResponse;

$file = 'path/to/file.txt';
$response = new BinaryFileResponse($file);
$response->headers->set('Content-Type', 'text/plain');
$response->setContentDisposition(
    ResponseHeaderBag::DISPOSITION_ATTACHMENT,
    'filename.txt'
);
return $response()



///////////////////////////////or
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\Stream;

$stream  = new Stream('path/to/stream');
$response = new BinaryFileResponse($stream);