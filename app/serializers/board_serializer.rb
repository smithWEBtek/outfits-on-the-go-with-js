class BoardSerializer < ActiveModel::Serializer
  attributes :id, :name
  belongs_to :user, serializer: BoardUserSerializer
end
