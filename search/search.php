public function search($text){
        return $this->createQueryBuilder('t')
                    
                    ->where('t.name LIKE :text')
                    ->setParameter('text',"%".$text."%")
                    ->getQuery()
                    ->getResult();
    }

    public function popularTags(){
        $query=$this->createQueryBuilder('t')
                  ->select('t as tags','count(p) as total')
                   ->join('t.posts','p')
                   ->groupBy('t')
                   ->orderBy('total','desc')
                   ->setMaxResults('10')
                  
                   ->getQuery()
                   ->getResult();
                   return $query;
  
      }