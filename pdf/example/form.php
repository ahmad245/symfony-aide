use Symfony\Component\Form\Extension\Core\Type\FileType;
class ArticleFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        ->add('imageFile', FileType::class, [
                'constraints' => [
                    new Image([
                        'maxSize' => '5M'
                    ])
                ]
            ])
        ;
    }
}