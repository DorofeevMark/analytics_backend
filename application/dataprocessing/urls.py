from django.conf.urls import url
from django.urls import path
from . import views
from django.conf import settings
from .itmo_backends import (
    AuthenticateByCodeISU,
    GetAuthenticationCodeISU
    )

urlpatterns = [
    path('api/domain/', views.DomainListCreateAPIView.as_view(),),
    path('api/domain/<int:pk>', views.DomainDetailAPIView.as_view(),),

    path('api/item/create', views.ItemsListCreateAPIView.as_view(),),
    path('api/item/', views.ItemsListAPIView.as_view(),),
    path('api/item/relation', views.ItemsWithRelationListAPIView.as_view(),),
    path('api/item/detail/<int:pk>', views.ItemDetailAPIView.as_view(),),

    path('api/relation/', views.RelationListAPIView.as_view(),),
    #path('api/relation/groupby', views.RelationListCreateGroupsAPIView.as_view(),),
    path('api/relation/<int:item1_id>', views.RelationListItemIdAPIView.as_view(),),
    path('api/relation/detail/<int:pk>', views.RelationRetrieveDestroyAPIView.as_view(),),
    path('api/relation/update/<int:pk>', views.RelationUpdateAPIView.as_view(),),
    path('api/relation/create', views.RelationCreateAPIView.as_view(), ),

    path('api/users/search', views.UserListForSearchView.as_view(), ),

    path('api/items/outcomes/<int:workprogram_id>', views.HighValueOutcomesListAPIView.as_view()),
    path('api/items/prerequisites/<int:workprogram_id>', views.HighValuePrerequisitesListAPIView.as_view()),

    path('api/upload/', views.FileUploadAPIView.as_view(), ),

    path('login/', AuthenticateByCodeISU.as_view(), ),
    path('api/cas-redirect/', GetAuthenticationCodeISU.as_view(), ),
    path('api/item/search_duplicate/<int:pk>', views.ItemsDetailForDuplicateSearchAPIView.as_view(),),
]
