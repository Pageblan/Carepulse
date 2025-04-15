'use client';
import { getNews } from '@/components/Service/getNews';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Image from 'next/image';

interface NewsArticle {
  urlToImage: string;
  title: string;
  content: string;
  author: string | null;
  publishedAt: string;
  url: string;
}

const Page: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [selectOption, setSelectOption] = useState('health');
  const [selectCountry, setSelectCountry] = useState('us');

  const getAllNews = async () => {
    try {
      const data = await getNews(selectOption, selectCountry);
      console.log("API Response:", data);
      if (data && data.data && data.data.articles) {
        setNewsData(data.data.articles);
      } else {
        console.error('No articles found in the response');
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  
  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectOption(event.target.value);
  };

  const selectCountryHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectCountry(event.target.value);
  };

  useEffect(() => {
    getAllNews();
  }, [selectOption, selectCountry]);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Latest News
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          Stay updated with the latest headlines from around the world
        </p>
      </header>

      {/* Selectors */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0 md:space-x-8 px-4">
        <div className="flex items-center">
          <label htmlFor="category" className="text-white mr-3 font-medium">
            Category:
          </label>
          <select
            id="category"
            name="category"
            value={selectOption}
            onChange={selectCategory}
            className="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="country" className="text-white mr-3 font-medium">
            Country:
          </label>
          <select
            id="country"
            name="country"
            value={selectCountry}
            onChange={selectCountryHandler}
            className="px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="us">United States</option>
            <option value="au">Australia</option>
            <option value="it">Italy</option>
            <option value="gb">United Kingdom</option>
            <option value="de">Germany</option>
          </select>
        </div>
      </div>

      {/* News Cards Grid */}
      <main className="max-w-7xl mx-auto px-4">
        {newsData.length === 0 ? (
          <p className="text-center text-gray-300">No news articles available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newsData.map((news, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              >
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col h-full"
                >
                  {/* News image */}

                  {/* Article Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 flex-1">
                      {news.content ? news.content.slice(0, 100) + '...' : 'No content available.'}
                    </p>
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>By: {news.author ? news.author : 'Unknown'}</span>
                      <span>{moment(news.publishedAt).format('L')}</span>
                    </div>
                    <div className="mt-3 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      Read more →
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
