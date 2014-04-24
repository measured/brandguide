module ApplicationHelper
  def ancestry_collection(items)
    result = []
    
    items.map do |item, sub_items|
      result << [('- ' * item.depth) + item.title, item.id]
      result += ancestry_collection(sub_items) unless sub_items.blank?
    end

    result
  end
end
