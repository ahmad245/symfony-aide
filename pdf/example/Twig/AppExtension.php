use Twig\TwigFunction;
class AppExtension extends AbstractExtension implements ServiceSubscriberInterface
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('uploaded_asset', [$this, 'getUploadedAssetPath'])
        ];
    }

    public static function getSubscribedServices()
    {
        return [
            UploaderHelper::class,
        ];
    }

    public function getUploadedAssetPath(string $path): string
    {
        return $this->container
            ->get(UploaderHelper::class)
            ->getPublicPath($path);
    }
}